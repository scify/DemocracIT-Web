package repositories.anorm

import anorm.SqlParser._
import anorm._
import model.dtos._


object RelevantMaterialParser{

  val Parse: RowParser[RelevantMaterial] = {

      long("id") ~
      str("title") ~
      long("consultation_id") ~
      str("url_source") ~
      str("actual_pdf_url") map
      {
        case id ~ title ~ consultation_id ~ src_url ~ pdf_url =>
          new RelevantMaterial(id, title, consultation_id, src_url, pdf_url)
      }

  }
}