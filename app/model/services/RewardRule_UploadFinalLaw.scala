package model.services

import java.util.UUID
import javax.inject.Inject


class RewardRule_UploadFinalLaw() extends RewardRuleTrait{

  override val action_id: Int = GamificationEngineTrait.UPLOAD_FILE_ACTION_ID

  override def getPoints(user_id: UUID): Int = {

    return 10;
  }
}
