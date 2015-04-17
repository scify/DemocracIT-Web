package democracit.dtos

import java.util.{ResourceBundle, Locale, Calendar, Date}

import org.ocpsoft.prettytime.PrettyTime

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
{
  def endDateFormatted = {
       // val lang = play.api.Play.current.configuration.getString("application.langs").get
      //  val locale = new Locale("el");
      // val stats = ResourceBundle.getBundle("org.ocpsoft.prettytime.i18n.Resources", locale);
        val t = new PrettyTime(Calendar.getInstance().getTime(),new Locale("el"))
        t.format(endDate)

    }

}

