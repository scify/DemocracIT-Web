package model.repositories.anorm

import anorm.SqlParser._
import anorm._
import model.dtos._


object ConsFinalLawRatingUsersParser{

  val Parse: RowParser[ConsFinalLawRatingUsers] = {

      get[java.util.UUID]("user_id") ~
      long("final_law_id") ~
      long("consultation_id") ~
      bool("liked") map
      {
        case id ~ final_law_id ~ consultation_id ~ liked =>
          new ConsFinalLawRatingUsers(id, final_law_id, consultation_id, liked)
      }

  }
}
