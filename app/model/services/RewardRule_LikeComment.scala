package model.services

import java.util.UUID


class RewardRule_LikeComment() extends RewardRuleTrait{

  override val action_id: Int = GamificationEngineTrait.LIKE_COMMENT
  override def getPoints(user_id: UUID): Int = {
    1
  }
}
