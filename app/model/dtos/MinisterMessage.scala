package model.dtos

import java.util.Date

/**
 * Created by pisaris on 10/7/2015.
 */
case class MinisterMessage (consultation_id: Long,
                          message:String,
                          date_added:Date
                          ) {
  def prettyDateFormat(date: Date) = {
    val formatIncomming = new java.text.SimpleDateFormat("yyyy-MM-dd HH:mm:ss")
    val formatOutgoing = new java.text.SimpleDateFormat("dd MMM yyyy HH:mm aaa")
    val dateFormated = formatOutgoing.format(formatIncomming.parse(date.toString))
    dateFormated
  }
}