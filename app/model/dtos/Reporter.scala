package model.dtos


case class CommentsPerArticle(article: Article, numberOfComments:Int)

case class AnnotationTagWithComments (annotationTag:AnnotationTags, numberOfComments:Int)

case class AnnotationTagPerArticleWithComments (annotationTag:AnnotationTags,article_id:Int, numberOfComments:Int)

case class UserCommentStats(user_id:Int, fullName:String, idiotita:String,number_of_comments:Int)


