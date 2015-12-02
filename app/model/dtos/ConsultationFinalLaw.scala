package model.dtos

import java.util.Date
import java.util.UUID

case class ConsultationFinalLaw (id:BigInt, consultation_id:BigInt, user_id:UUID, date_added:Date, num_of_approvals:Int, num_of_dissaprovals:Int, file_text:String, file_path:String, active:Int)

