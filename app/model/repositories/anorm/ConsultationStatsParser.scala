package model.repositories.anorm

import anorm.SqlParser._
import anorm._
import model.dtos._


object ConsultationStatsParser{

  val Parse: RowParser[ConsultationStats] = {
    int("id") ~
      get[Option[Int]]("NumberOfArticles") ~
      get[Option[Int]]("NumberOfComments") ~
      double("DaysActive") ~
      bool("isActive") ~
      int("organizationId") ~
      str("title") ~
      str("categTitle")  ~
      int("order") map
      {
        case  consultationId ~
          numberOfArticles ~
          numberOfComments ~
          daysActive ~
          isActive ~
          organizationId ~
          organizationTitle ~
          organizationCategory  ~
          organizationOrder =>
          new ConsultationStats(consultationId,
            numberOfArticles.getOrElse(0),
            numberOfComments.getOrElse(0),
            daysActive.asInstanceOf[Int],
            isActive,
            organizationId.asInstanceOf[Byte],
            organizationTitle,
            organizationCategory,
            organizationOrder)
      }
  }
}
