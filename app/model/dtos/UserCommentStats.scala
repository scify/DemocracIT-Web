package model.dtos

import java.util.UUID


case class UserCommentStats(user_id:Option[UUID], first_name:String, last_name:String, email:String, role:Int, number_of_comments:Int)
