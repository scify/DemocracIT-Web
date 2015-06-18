package repositories.anorm
import anorm.SqlParser._
import anorm._
import model.dtos._


object OrganizationStatsParser{

  val Parse: RowParser[OrganizationStats] = {
    int("id") ~
    str("title") ~
    str("categTitle") ~
    int("count")  ~ int("order") map
      {
        case id ~ title ~ categTitle ~ count ~ order=>
          new OrganizationStats(id,title,categTitle,count,order)
      }
  }
}
