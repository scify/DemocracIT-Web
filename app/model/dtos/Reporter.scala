package model.dtos


case class AnnotationTagWithComments (annotationTag:AnnotationTags, numberOfComments:Int)

case class AnnotationTagPerArticleWithComments (annotationTag:AnnotationTags,article_name:String, numberOfComments:Int)

case class UserCommentStats(user_id:Int, fullName:String, idiotita:String,number_of_comments:Int)


