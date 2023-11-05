import Image from '../model/image'
import connectmongodb from '../../lib/mongodb'
import mongoose from 'mongoose'

export const dynamic = 'force-dynamic';
export const revalidate = 1;

const Message = 'from image list'
connectmongodb(Message)

const imagedata = await Image.find({})

//Close connection
mongoose.connection.close

export async function GET(req){
  // return new Response(plant)
  return new Response(JSON.stringify(imagedata))
}
