package model.services

import java.util.UUID

/**
 * Handles actions to users.
 */
trait GamificationEngineTrait {
  def rewardUser(user_id: UUID, action_id:Int, relatedData:Any): Int
}

object GamificationEngineTrait
{
  val UPLOAD_FILE_ACTION_ID = 1
  val COMMENT_ON_CONSULTATION_ARTICLE = 2 //not implemented yet
  val COMMENT_ON_CONSULTATION_PARAGRAPH = 3 //not implemented yet
  val UPLOADED_FILE_RATED_LIKE = 4
  val UPLOADED_FILE_RATED_DISLIKE = 5
  val REMOVE_UPLOADED_FILE = 6
}

