package model.repositories.anorm

import anorm.SqlParser._
import anorm._
import model.dtos._


object ConsFinalLawParser{

  val Parse: RowParser[ConsultationFinalLaw] = {

      long("id") ~
      long("consultation_id")~
      get[java.util.UUID]("user_id") ~
      date("date_added") ~
      int("num_of_approvals") ~
      int("num_of_dissaprovals") ~
      str("file_text") ~
      str("file_path") map
      {
        case id ~ consultation_id ~ user_id ~ date_added ~ num_of_approvals ~ num_of_dissaprovals ~ file_text ~ file_path =>
          new ConsultationFinalLaw(id, consultation_id, user_id, date_added, num_of_approvals, num_of_dissaprovals, file_text, file_path)
      }

  }
}
