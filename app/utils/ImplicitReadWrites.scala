package utils

import model.dtos.CommentSource.CommentSource
import model.dtos._
import play.api.data.FormError
import play.api.i18n.MessagesApi
import play.api.i18n.Messages
import play.api.libs.json._

object ImplicitReadWrites  {

  implicit object FormErrorWrites extends Writes[FormError] {

    implicit var messages:MessagesApi = null


    def apply(implicit messages:MessagesApi, messagesObj:Messages): Unit = {
        this.messages = messages
    }

    override def writes(o: FormError): JsValue = Json.obj(
       "key" -> Json.toJson(o.key),
      "message" -> Json.toJson(this.messages(o.message))
    )
  }


  implicit object ConsultationWrites extends Writes[Consultation] {
    implicit var messagesObj:Messages  = null

    def apply(messagesObj:Messages): Unit = {
      this.messagesObj = messagesObj
    }
    override def writes(c:Consultation):JsValue = Json.obj(
        "id" -> Json.toJson(c.id),
        "title" -> Json.toJson(c.title),
        "isActive" -> Json.toJson(c.isActive),
        "totalDurationFormatted" -> Json.toJson(c.totalDurationFormatted(this.messagesObj)),
        "endDateFormatted" -> Json.toJson(c.endDateFormatted(this.messagesObj)),
        "articlesNum" -> Json.toJson(c.articlesNum)
    )
  }
  implicit val ByteRead = new Reads[Byte] {
     override def reads(json: JsValue): JsResult[Byte] = JsSuccess(json.as[Int].toByte)
  }
  implicit object byteWrites extends Writes[Byte] {
    def writes(b:Byte) = Json.toJson(b.toInt)
  }
  implicit val userCommentsWrites = Json.writes[UserCommentStats]
  implicit val annotationWrites = Json.writes[AnnotationTags]
  implicit val annotationWithCommentsWrites = Json.writes[AnnotationTagWithComments]
  implicit val annotationPerArticlesWrites = Json.writes[AnnotationTagPerArticleWithComments]
  implicit val relevantLawsWrites = Json.writes[RelevantLaws]
  implicit val articleWrites = Json.writes[Article]
  implicit val consultationsPerMonthWrites = Json.writes[ConsultationsPerMonth]
  implicit val consfrequenciesPerOrganizationWrites = Json.writes[ConsFrequencyPerOrganization]
  implicit val consdurationsPerOrganizationWrites = Json.writes[ConsDurationsPerOrganization]
  implicit val consdurationsWrites = Json.writes[ConsDurations]
  implicit val consCommPerOrganizationWrites = Json.writes[CommPerConsPerOrganization]
  implicit val consultationForEvaluationWrites = Json.writes[ConsultationForEvaluation]
  implicit val consultationRatingUserWrites = Json.writes[ConsFinalLawRatingUsers]

  implicit val discussionThreadWrites= Json.writes[DiscussionThread]
  implicit object commentSourcesWrites extends Writes[CommentSource] {
    def writes(c:CommentSource) = Json.obj(
      "commentSource" -> Json.toJson(c.id)

    )
  }
  implicit val commentsWrites = Json.writes[model.dtos.Comment]
  implicit val commentWithArticleNameWrites = Json.writes[model.dtos.CommentWithArticleName]
  implicit val finalLawAnnotationWrites = Json.writes[model.dtos.FinalLawUserAnnotation]
  implicit val consultationFinalLawStatsWrites = Json.writes[model.dtos.ConsultationFinalLawStats]
}

