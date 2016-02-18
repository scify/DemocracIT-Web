package model.viewmodels.forms

import java.util.UUID

import play.api.data.Form
import play.api.data.Forms._


object RateCommentForm {

  val form = Form(
    mapping(
      "comment_id" -> longNumber,
      "liked" -> optional(boolean),
      "commenterId"->optional(uuid),
      "annId"->text,
      "articleId"->longNumber,
      "consultationId"->optional(longNumber)
    )(RateCommentFormModel.apply)(RateCommentFormModel.unapply)
  )

  case class RateCommentFormModel(comment_id: Long, liked:Option[Boolean], commenterId: Option[UUID], annId:String, articleId:Long, consultationId:Option[Long])
}
