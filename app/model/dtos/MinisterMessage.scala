package model.dtos

import java.util.Date

/**
 * Created by pisaris on 10/7/2015.
 */
case class MinisterMessage (consultation_id: Long,
                          message:String,
                          date_added:Date
                          );
