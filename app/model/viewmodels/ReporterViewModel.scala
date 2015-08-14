package model.viewmodels

import model.dtos._
import play.api.libs.json._
import utils.ImplicitReadWrites._

case class ReporterViewModel(consultation:model.dtos.Consultation,
                               user: Option[model.User],
                               relevantMaterials: Seq[RelevantMaterial],
                               commentsPerArticle:  Seq[Article],
                               annotationTagWithComments: Seq[AnnotationTagWithComments],
                               annotationTagPerArticleWithComments: Seq[AnnotationTagPerArticleWithComments]/*,
                               userCommentStats: Seq[UserCommentStats]*/
                              )
{

  def totalComments:Int = {
    var total = 0
    for(article <- commentsPerArticle) {
      total += article.commentsNum
    }
    total
  }
}

