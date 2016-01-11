package model.services

import java.util.UUID


class RewardRule_CommentOnConsultation() extends RewardRuleTrait{

  override val action_id: Int = GamificationEngineTrait.COMMENT_ON_CONSULTATION
  override def getPoints(user_id: UUID): Int = {
    return 5;
  }
}
