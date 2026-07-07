export const VALID_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
export const MAX_IMAGE_SIZE = 5 * 1024 * 1024;
export const CSV_REQUIRED_COLUMNS = ['name', 'price', 'category'];
export const BATCH_SIZE = 500;
export const DEFAULT_PAGE = 1;
export const DEFAULT_LIMIT = 20;
export const SORTABLE_FIELDS = ['name', 'price', 'createdAt'] as const;
export const ALLOWED_SORT_ORDERS = ['asc', 'desc'] as const;
