import fs from 'fs';
import path from 'path';
import csvParser from 'csv-parser';
import ExcelJS from 'exceljs';
import { Readable } from 'stream';
import { ProductRepository } from '../repositories/product.repository';
import { CategoryRepository } from '../repositories/category.repository';
import { NotFoundError, BadRequestError } from '../utils/errors';
import { BATCH_SIZE } from '../constants';
import { BulkUploadResult } from '../types';
import { config } from '../config';

export class ProductService {
  private productRepo: ProductRepository;
  private categoryRepo: CategoryRepository;

  constructor() {
    this.productRepo = new ProductRepository();
    this.categoryRepo = new CategoryRepository();
  }

  async create(data: { name: string; image?: string; price: number; categoryId: string }) {
    const category = await this.categoryRepo.findByUuid(data.categoryId);
    if (!category) {
      throw new NotFoundError('Category');
    }

    return this.productRepo.create({
      name: data.name,
      image: data.image,
      price: data.price,
      categoryId: category.id,
    });
  }

  async getById(id: number) {
    const product = await this.productRepo.findById(id);
    if (!product) {
      throw new NotFoundError('Product');
    }
    return product;
  }

  async getByUuid(uuid: string) {
    const product = await this.productRepo.findByUuid(uuid);
    if (!product) {
      throw new NotFoundError('Product');
    }
    return product;
  }

  async list(params: {
    page: number;
    limit: number;
    sortBy: string;
    sortOrder: 'asc' | 'desc';
    search?: string;
    categoryId?: string;
  }) {
    return this.productRepo.findAll(params);
  }

  async update(id: number, data: { name?: string; image?: string; price?: number; categoryId?: string }) {
    const product = await this.productRepo.findById(id);
    if (!product) {
      throw new NotFoundError('Product');
    }

    const updateData: any = {};
    if (data.name !== undefined) updateData.name = data.name;
    if (data.image !== undefined) updateData.image = data.image;
    if (data.price !== undefined) updateData.price = data.price;
    if (data.categoryId !== undefined) {
      const category = await this.categoryRepo.findByUuid(data.categoryId);
      if (!category) {
        throw new NotFoundError('Category');
      }
      updateData.categoryId = category.id;
    }

    return this.productRepo.update(id, updateData);
  }

  async delete(id: number) {
    const product = await this.productRepo.findById(id);
    if (!product) {
      throw new NotFoundError('Product');
    }

    await this.productRepo.delete(id);
  }

  async bulkUpload(filePath: string): Promise<BulkUploadResult> {
    return new Promise((resolve, reject) => {
      const results: Array<{ name: string; price: number; categoryName: string; image?: string }> = [];
      const errors: Array<{ row: number; message: string; data?: Record<string, unknown> }> = [];
      let rowNumber = 0;

      fs.createReadStream(filePath)
        .pipe(csvParser())
        .on('data', (row) => {
          rowNumber++;
          const name = row.name?.trim();
          const price = parseFloat(row.price);
          const categoryName = row.category?.trim();
          const image = row.image?.trim() || undefined;

          if (!name || isNaN(price) || !categoryName) {
            errors.push({
              row: rowNumber,
              message: `Missing required fields (name, price, category)`,
              data: row,
            });
            return;
          }

          if (price <= 0) {
            errors.push({
              row: rowNumber,
              message: 'Price must be greater than 0',
              data: row,
            });
            return;
          }

          results.push({ name, price, categoryName, image });
        })
        .on('end', async () => {
          try {
            let inserted = 0;
            let failed = 0;

            for (let i = 0; i < results.length; i += BATCH_SIZE) {
              const batch = results.slice(i, i + BATCH_SIZE);

              for (const item of batch) {
                try {
                  let category = await this.categoryRepo.findByName(item.categoryName);
                  if (!category) {
                    category = await this.categoryRepo.create({ name: item.categoryName });
                  }

                  await this.productRepo.create({
                    name: item.name,
                    price: item.price,
                    categoryId: category.id,
                    image: item.image,
                  });
                  inserted++;
                } catch (err) {
                  failed++;
                  errors.push({
                    row: i + batch.indexOf(item) + 1,
                    message: err instanceof Error ? err.message : 'Unknown error',
                    data: item,
                  });
                }
              }
            }

            fs.unlinkSync(filePath);
            resolve({ inserted, failed, errors });
          } catch (err) {
            reject(err);
          }
        })
        .on('error', (err) => {
          reject(err);
        });
    });
  }

  async exportCsv(): Promise<Readable> {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Products');

    worksheet.columns = [
      { header: 'UUID', key: 'uuid', width: 40 },
      { header: 'Product Name', key: 'name', width: 30 },
      { header: 'Category', key: 'category', width: 20 },
      { header: 'Price', key: 'price', width: 15 },
      { header: 'Created Date', key: 'createdAt', width: 25 },
    ];

    const products = await this.productRepo.findForExport();
    for (const product of products) {
      worksheet.addRow({
        uuid: product.uuid,
        name: product.name,
        category: product.category.name,
        price: product.price,
        createdAt: product.createdAt.toISOString(),
      });
    }

    const buffer = await workbook.csv.writeBuffer();
    return Readable.from(buffer as any);
  }

  async exportXlsx(): Promise<Buffer> {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Products');

    worksheet.columns = [
      { header: 'UUID', key: 'uuid', width: 40 },
      { header: 'Product Name', key: 'name', width: 30 },
      { header: 'Category', key: 'category', width: 20 },
      { header: 'Price', key: 'price', width: 15 },
      { header: 'Created Date', key: 'createdAt', width: 25 },
    ];

    const products = await this.productRepo.findForExport();
    for (const product of products) {
      worksheet.addRow({
        uuid: product.uuid,
        name: product.name,
        category: product.category.name,
        price: product.price,
        createdAt: product.createdAt.toISOString(),
      });
    }

    const buffer = await workbook.xlsx.writeBuffer();
    return Buffer.from(buffer);
  }

  async getDashboard() {
    const [userRepo, categoryRepo, productRepo] = await Promise.all([
      import('../repositories/user.repository').then((m) => new m.UserRepository()),
      Promise.resolve(this.categoryRepo),
      Promise.resolve(this.productRepo),
    ]);

    const [totalUsers, totalCategories, totalProducts, recentProducts] = await Promise.all([
      userRepo['db'].user.count(),
      categoryRepo['db'].category.count(),
      productRepo.count(),
      productRepo.findRecent(5),
    ]);

    return {
      totalUsers,
      totalCategories,
      totalProducts,
      recentProducts,
    };
  }
}
