package model.dtos

import java.util.concurrent.TimeUnit
import java.util.{Calendar, Date, Locale}

import org.joda.time.DateTime
import org.ocpsoft.prettytime.PrettyTime
import play.api.i18n.Messages
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

  def totalDurationFormatted()(implicit messages:Messages) = {

    if (totalDurationInDays==0)
      Pluralizer.get(TimeUnit.HOURS.convert(endDate.getTime - startDate.getTime, TimeUnit.MILLISECONDS)," " + messages("hour"), " " + messages("hours"))
    else
    Pluralizer.get(totalDurationInDays," " + messages("day"), " " + messages("days"))
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
  def endDateFormatted()(implicit messages:Messages) = {
       // val lang = play.api.Play.current.configuration.getString("application.langs").get
      //  val locale = new Locale("el");
      // val stats = ResourceBundle.getBundle("org.ocpsoft.prettytime.i18n.Resources", locale);
        val t = new PrettyTime(Calendar.getInstance().getTime(), new Locale("el"))

    try{
      //todo: on production the _el.properties are not loaded and the english one's are always displayed. Could not find out why, skipped to manual calculation of the string due to lack of development time needed to resolve the issue
          manualCalculation(t, messages)
    }
    catch
      {
        case _: Throwable =>  t.format(endDate)
      }
    }

  private def manualCalculation(t:PrettyTime, messages:Messages):String = {
    val approximateDuration = t.approximateDuration(endDate)
    val unit =approximateDuration.getUnit()
    import scala.collection.JavaConverters._
    val duration = t.calculatePreciseDuration(endDate).asScala.toList
    val d = duration.filter(p=>p.getUnit== unit)
    val quantity =Math.abs(d.head.getQuantity())

    var prefix= messages("before") + " "
    if (approximateDuration.isInFuture())
      prefix= messages("in") + " "

    if (unit.isInstanceOf[org.ocpsoft.prettytime.units.Day])
      prefix + utils.Pluralizer.get(quantity ,messages("day"),messages("days"))
    else if (unit.isInstanceOf[org.ocpsoft.prettytime.units.Week])
      prefix + utils.Pluralizer.get(quantity ,messages("week"),messages("weeks"))
    else if (unit.isInstanceOf[org.ocpsoft.prettytime.units.Decade])
      prefix + utils.Pluralizer.get(quantity ,messages("decade"),messages("decades"))
    else if (unit.isInstanceOf[org.ocpsoft.prettytime.units.Month])
      prefix + utils.Pluralizer.get(quantity ,messages("month"),messages("months"))
    else if (unit.isInstanceOf[org.ocpsoft.prettytime.units.Year])
      prefix + utils.Pluralizer.get(quantity ,messages("year"),messages("years"))
    else if (unit.isInstanceOf[org.ocpsoft.prettytime.units.Hour])
      prefix +  utils.Pluralizer.get(quantity ,messages("hour"),messages("hours"))
    else if (unit.isInstanceOf[org.ocpsoft.prettytime.units.Minute])
      prefix +  utils.Pluralizer.get(quantity ,messages("minute"),messages("minutes"))
    else
      t.format(endDate)
  }

}

