package model.services.rewardRules

import java.util.UUID

import model.services.GamificationEngineTrait


class RewardRule_CommentWithProblemTags() extends RewardRuleTrait{

  override val action_id: Int = GamificationEngineTrait.COMMENT_WITH_PROBLEM_TAGS
  override def getPoints(user_id: UUID): Int = {
    // reward only if less than 10 comments have been liked today by the user
    1
  }
}
