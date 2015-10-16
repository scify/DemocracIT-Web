package model.dtos


import java.util.concurrent.TimeUnit
import java.util.{Calendar, Date, Locale}

import org.joda.time.DateTime
import org.ocpsoft.prettytime.units.Day
import org.ocpsoft.prettytime.{Duration, TimeFormat, PrettyTime}
import utils.Pluralizer


case class Consultation( id:Long,
                   startDate:Date,
                   endDate:Date,
                   title: String,
                   shortDescr:String,
                   organization: Organization,
                   status: Short,
                   report_text: Option[String],
                   report_url: Option[String],
                   completed_text: Option[String],
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

  def isCompletedText = {
    !completed_text.isEmpty
  }

  def prettyDateFormat(date:Date) = {
    val formatIncomming = new java.text.SimpleDateFormat("yyyy-MM-dd HH:mm:ss")
    val formatOutgoing = new java.text.SimpleDateFormat("dd MMM yyyy HH:mm aaa")
    val dateFormated = formatOutgoing.format(formatIncomming.parse(date.toString))
    dateFormated
  }
  def endDateFormatted = {
       // val lang = play.api.Play.current.configuration.getString("application.langs").get
      //  val locale = new Locale("el");
      // val stats = ResourceBundle.getBundle("org.ocpsoft.prettytime.i18n.Resources", locale);
        val t = new PrettyTime(Calendar.getInstance().getTime(), new Locale("el"))

    try{
      //todo: on production the _el.properties are not loaded and the english one's are always displayed. Could not find out why, skipped to manual calculation of the string due to lack of development time needed to resolve the issue
          manualCalculation(t)
    }
    catch
      {
        case _: Throwable =>  t.format(endDate)
      }
    }

  private def manualCalculation(t:PrettyTime):String = {
    val approximateDuration = t.approximateDuration(endDate)
    val unit =approximateDuration.getUnit()
    import scala.collection.JavaConverters._
    val duration = t.calculatePreciseDuration(endDate).asScala.toList
    val d = duration.filter(p=>p.getUnit== unit)
    val quantity =Math.abs(d.head.getQuantity())

    var prefix="πριν "
    if (approximateDuration.isInFuture())
      prefix="σε "

    if (unit.isInstanceOf[org.ocpsoft.prettytime.units.Day])
      prefix + utils.Pluralizer.get(quantity ,"ημέρα","ημέρες")
    else if (unit.isInstanceOf[org.ocpsoft.prettytime.units.Week])
      prefix + utils.Pluralizer.get(quantity ,"εβδομάδα","εβδομάδες")
    else if (unit.isInstanceOf[org.ocpsoft.prettytime.units.Decade])
      prefix + utils.Pluralizer.get(quantity ,"δεκαετία","δεκαετίες")
    else if (unit.isInstanceOf[org.ocpsoft.prettytime.units.Month])
      prefix + utils.Pluralizer.get(quantity ,"μήνα","μήνες")
    else if (unit.isInstanceOf[org.ocpsoft.prettytime.units.Year])
      prefix + utils.Pluralizer.get(quantity ,"χρόνο","χρόνια")
    else if (unit.isInstanceOf[org.ocpsoft.prettytime.units.Hour])
      prefix +  utils.Pluralizer.get(quantity ,"ώρα","ώρες")
    else if (unit.isInstanceOf[org.ocpsoft.prettytime.units.Minute])
      prefix +  utils.Pluralizer.get(quantity ,"λεπτό","λεπτά")
    else
      t.format(endDate)
  }

}

