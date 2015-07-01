package repositories.anorm

import anorm._
import anorm.SqlParser._
import model.dtos._


object ArticleParser{

  val Parse: RowParser[Article] = {

    long("article_id") ~
    long("consultation_id") ~
    str("article_title") ~
    str("article_body") ~
    int("art_order") ~
    get[Option[Int]]("comment_num") map
      {
        case id ~ consultation_id ~ title ~ body ~ art_order ~ comment_num =>
          new Article(id, consultation_id,title,body, art_order, comment_num.getOrElse(0))
      }

  }
}
