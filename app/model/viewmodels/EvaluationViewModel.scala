package model.viewmodels

import model.User
import model.dtos.ConsultationsPerMonth

case class EvaluationViewModel (user: Option[User], consultationsPerMonth: Seq[ConsultationsPerMonth]) {

}
