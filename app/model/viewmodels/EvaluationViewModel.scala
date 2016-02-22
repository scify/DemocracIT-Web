package model.viewmodels

import model.dtos.{User, ConsultationsPerMonth}
import play.api.i18n.Messages
import play.api.libs.json.Json
import utils.ImplicitReadWrites._

case class EvaluationViewModel (user: Option[User], consultationsPerMonth: Seq[ConsultationsPerMonth]) {
  def consultationsPerMonthToJson():String =Json.toJson(consultationsPerMonth).toString()

  def getEvaluationMessages(messages: Messages):String = {
    val messageList:Map[String,String] = Map(
      "consultations" -> messages("evaluation.consultations"),
      "consultation" -> messages("evaluation.consultation"),
      "organizationHasNoCons" -> messages("evaluation.organizationHasNoCons"),
      "numberOfCons" -> messages("evaluation.numberOfCons"),
      "months" -> messages("evaluation.months"),
      "monthsConsActive" -> messages("evaluation.monthsConsActive"),
      "consAllocation" -> messages("evaluation.consAllocation"),
      "days" -> messages("days"),
      "percentage" -> messages("evaluation.percentage"),
      "numberOfComments" -> messages("evaluation.numberOfComments"),
      "consWithFL" -> messages("evaluation.consWithFL"),
      "consWithoutFL" -> messages("evaluation.consWithoutFL"),
      "consWithFLTitle" -> messages("evaluation.consWithFLTitle"),
      "consTo" -> messages("consultations.search.to"),
      "dateWhenConsWasActive" -> messages("evaluation.dateWhenConsWasActive"),
      "commentsPlural" -> messages("reporter.commentsPlural"),
      "loading" -> messages("evaluation.loading"),
      "numberOfNewConsPerMonth" -> messages("evaluation.numberOfNewConsPerMonth")
    )
    Json.toJson(messageList).toString()
  }

}
