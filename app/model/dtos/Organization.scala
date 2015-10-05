package model.dtos

case class Organization(val id:Int, val title:String, val category:String = "", val categDisplayOrder:Int = -1)
