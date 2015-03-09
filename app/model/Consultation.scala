package model
import org.joda.time.DateTime

class Consultation(val id:Int,
                   val startDate:DateTime,
                   val endDate:DateTime,
                   val title: String,
                   val shortDescr:String,
                   val organization: Organization,
                   val status: Short,
                   val report_text: String,
                   val articlesNum:Int,
                   val articles:List[Article])


