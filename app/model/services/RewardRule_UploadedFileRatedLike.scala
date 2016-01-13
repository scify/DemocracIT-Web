package model.services

import java.util.UUID


class RewardRule_UploadedFileRatedLike() extends RewardRuleTrait{

  override val action_id: Int = GamificationEngineTrait.UPLOADED_FILE_RATED_LIKE
  override def getPoints(user_id: UUID): Int = {
    5
  }
}
