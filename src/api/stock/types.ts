export type StockData = {
  id: string
  price_id: string
  day: string
  code: string
  user_id: number
  category_id: string
  pattern: number
  market: string
  remark: number
  created_at: string
  updated_at: number
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
