import Image from '../model/image'
import { NextResponse } from 'next/server'
import connectmongodb from '../../lib/mongodb'
import mongoose from 'mongoose'

export async function POST(request){
    const PostData = await request.json()

    console.log(PostData);

    await connectmongodb('Source: image uploaded')
    await Image.create(PostData)

    //Close connection
    mongoose.connection.close

    return NextResponse.json({message: "image uploaded"},{status:"200"})
}