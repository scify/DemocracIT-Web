package model.dtos


import java.util.concurrent.TimeUnit
import java.util.{ResourceBundle, Locale, Calendar, Date}

import org.joda.time.{Period,Days, DateTime}
import org.ocpsoft.prettytime.PrettyTime
import utils.Pluralizer


case class Consultation( id:Long,
                   startDate:Date,
                   endDate:Date,
                   title: String,
                   shortDescr:String,
                   organization: Organization,
                   status: Short,
                   report_text: Option[String],
                   articlesNum:Int,
                   opengov_url:String,
                   var articles:List[Article] =Nil)
{
  val isActive = endDate.after(DateTime.now().toDate)
  val totalDurationInDays =   TimeUnit.DAYS.convert(endDate.getTime - startDate.getTime, TimeUnit.MILLISECONDS)

  def totalDurationFormatted = {
    if (totalDurationInDays==0)
      Pluralizer.get(TimeUnit.HOURS.convert(endDate.getTime - startDate.getTime, TimeUnit.MILLISECONDS)," ώρα", " ώρες")
    else
    Pluralizer.get(totalDurationInDays," ημέρα", " ημέρες")
  }

  def endDateFormatted = {
       // val lang = play.api.Play.current.configuration.getString("application.langs").get
      //  val locale = new Locale("el");
      // val stats = ResourceBundle.getBundle("org.ocpsoft.prettytime.i18n.Resources", locale);
        val t = new PrettyTime(Calendar.getInstance().getTime(),new Locale("el"))
        t.format(endDate)

    }

}

