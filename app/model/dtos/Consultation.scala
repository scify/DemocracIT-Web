package democracit.dtos

import java.util.Date

import org.joda.time.DateTime

case class Consultation(val id:Long,
                   val startDate:Date,
                   val endDate:Date,
                   val title: String,
                   val shortDescr:String,
                   val organization: Organization,
                   val status: Short,
                   val report_text: Option[String],
                   val articlesNum:Int,
                   var articles:List[Article] =Nil)

