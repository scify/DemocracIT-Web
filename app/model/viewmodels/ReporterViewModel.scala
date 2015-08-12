package model.viewmodels

import model.dtos._
import play.api.libs.json._
import utils.ImplicitWrites._

case class ReporterViewModel(consultation:model.dtos.Consultation,
                                 user: Option[model.User],
                             relevantMaterials: Seq[RelevantMaterial])
{

}

