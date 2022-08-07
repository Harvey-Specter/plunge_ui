export type StockData = {
  id: number
  name: string
  cate33: string
  code: string
  user_id: string
  category_id: number
  pattern: string
  market: string
  remark: string
  created_at: string
  category_ids: number[]
  score: number
  size: string
  cateName: string
  newCateName: string
}

// | id          | int unsigned | NO   | PRI | NULL    | auto_increment |
// | price_id    | int unsigned | NO   |     | NULL    |                |
// | day         | date         | NO   | MUL | NULL    |                |
// | code        | varchar(255) | NO   | MUL | NULL    |                |
// | user_id     | int unsigned | NO   |     | NULL    |                |
// | category_id | int unsigned | NO   |     | NULL    |                |
// | pattern     | varchar(255) | NO   |     | NULL    |                |
// | market      | varchar(255) | NO   |     | NULL    |                |
// | remark      | varchar(255) | YES  |     | NULL    |                |
// | created_at  | timestamp    | YES  |     | NULL    |                |
// | updated_at  | timestamp    | YES  |     |
