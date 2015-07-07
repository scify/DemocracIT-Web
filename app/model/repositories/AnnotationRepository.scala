package model.repositories

import anorm._
import model.dtos.AnnotationTags
import play.api.db.DB
import play.api.Play.current

class AnnotationRepository {

  def loadAnnotationTypes():Seq[AnnotationTags] = {

    DB.withConnection { implicit c =>

      val sql:SqlQuery = SQL("select * from public.annotation_types_lkp")

        sql().map( row =>
                AnnotationTags(row[Long]("id"),
                               row[String]("description"))
                  ).toList

    }

  }


}
