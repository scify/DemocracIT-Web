package model.dtos

/**
 * Created by pisaris on 19/11/2015.
 */
case class CommPerConsPerOrganization (organizationId:Long, organizationName:String, var commentWindow:String, numberOfConsultations:Int, groupTitle:Option[String], cons_ids:String)
