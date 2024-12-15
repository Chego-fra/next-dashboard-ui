"use client"
import Image from "next/image"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const data = [
  {
    name: 'Jan',
    income: 4000,
    expense: 2400
  },
  {
    name: 'Feb',
    income: 5000,
    expense: 3400
  },
  {
    name: 'Mar',
    income: 6000,
    expense: 4400
  },
  {
    name: 'April',
    income: 2000,
    expense: 1400
  },
  {
    name: 'May',
    income: 8000,
    expense: 5400
  },
  {
    name: 'June',
    income: 9000,
    expense: 3400
  },
  {
    name: 'July',
    income: 10000,
    expense: 6400
  },
  {
    name: 'August',
    income: 12000,
    expense: 7400
  },
  {
    name: 'Sept',
    income: 13000,
    expense: 9400
  },
  {
    name: 'Oct',
    income: 15000,
    expense: 5400
  },
  {
    name: 'Nov',
    income: 15000,
    expense: 8400
  },
  {
    name: 'Dec',
    income: 16000,
    expense: 3400
  },
];
const FinaceChart = () =>{
    return(
        <div className="bg-white rounded-xl w-full h-full p-4">
            {/* {TITLE} */}
            <div className='flex justify-between items-center'>
                <h1 className='text-lg font-semibold'>Finance</h1>
                <Image src="/moreDark.png" alt="" width={20} height={20} />
            </div>
            <ResponsiveContainer width="100%" height="90%">
        <LineChart
          width={500}
          height={300}
          data={data}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#ddd" />
          <XAxis dataKey="name"  tick={{fill:"#d1d5db"}} tickLine={false} tickMargin={10}/>
          <YAxis  tick={{fill:"#d1d5db"}} tickLine={false} tickMargin={20}/>
          <Tooltip />
          <Legend align='center' verticalAlign='top' wrapperStyle={{paddingTop:"10px", paddingBottom:"30px"}}/>
          <Line type="monotone" dataKey="income" stroke="#FAE27C" strokeWidth={5}/>
          <Line type="monotone" dataKey="expense" stroke="#C3EBFA" strokeWidth={5}/>
        </LineChart>
      </ResponsiveContainer>
            </div>
    )
}
export default FinaceChart