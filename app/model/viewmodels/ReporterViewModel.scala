package model.viewmodels

import model.dtos._
import play.api.libs.json._
import utils.ImplicitWrites._

case class ReporterViewModel(consultation:model.dtos.Consultation,
                               user: Option[model.User],
                               relevantMaterials: Seq[RelevantMaterial]/*,
                               commentsPerArticle:  Seq[CommentsPerArticle],
                               annotationTagWithComments: Seq[AnnotationTagWithComments],
                               annotationTagPerArticleWithComments: Seq[AnnotationTagPerArticleWithComments],
                               userCommentStats: Seq[UserCommentStats]*/
                              )
{

  /*def totalComments:Int = {
    ???
  }*/
  def totalConsultationComments():Int = {
    var total = 0
    for(article <- consultation.articles) {
      total += article.commentsNum
    }
    total
  }
}

