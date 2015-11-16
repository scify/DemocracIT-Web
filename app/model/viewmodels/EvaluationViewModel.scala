package model.viewmodels

import model.User
import model.dtos.ConsultationsPerMonth
import play.api.libs.json.Json
import utils.ImplicitReadWrites._

case class EvaluationViewModel (user: Option[User], consultationsPerMonth: Seq[ConsultationsPerMonth]) {
  def consultationsPerMonthToJson():String =Json.toJson(consultationsPerMonth).toString()

}
