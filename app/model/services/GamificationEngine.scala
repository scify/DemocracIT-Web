package model.services

import java.util.UUID
import javax.inject.Inject


class GamificationEngine @Inject()() extends GamificationEngineTrait{

  val rules: List[RewardRuleTrait] = List(new RewardRule_UploadFinalLaw(),new RewardRule_CommentOnConsultation())
  override def rewardUser(user_id: UUID,action_id:Int): Int = {
    5
  }
}
