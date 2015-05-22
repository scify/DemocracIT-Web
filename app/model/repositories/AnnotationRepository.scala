package democracit.repositories

import _root_.anorm.SqlQuery
import anorm._
import model.dtos.AnnotationType
import play.api.db.DB
import play.api.Play.current

class AnnotationRepository {

  def loadAnnotationTypes():Seq[AnnotationType] = {

    DB.withConnection { implicit c =>

      val sql:SqlQuery = SQL("select * from public.annotation_types_lkp")

        sql().map( row =>
                AnnotationType(row[Long]("id"),
                               row[String]("description"))
                  ).toList

    }

  }


}
