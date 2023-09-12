import { ArrowDownward, ArrowUpward } from "@mui/icons-material";

const TransactionCard = ({
  transaction,
  address
}: { transaction: any, address: string }) => {
  return (
    <div className='border hover:cursor-pointer hover:bg-slate-200 gap-4 flex items- justify-between rounded-md m-4 p-4 border-blue-900 shadow-lg h-24'>
      <div className='flex gap-4 items-center'>
        <div className='h-16 w-16 flex-col rounded-full bg-blue-700 flex items-center justify-center'>
          {transaction.from === address ? <ArrowDownward /> : <ArrowUpward />}
        </div>
        <div>
          <div className='w-52 overflow-hidden text-ellipsis text-xl font-bold text-blue-800'>
            {transaction.hash}
          </div>
          <div className='w-52 overflow-hidden text-ellipsis text-slate-900'>
            {transaction.from}
          </div>
        </div>
      </div>
      <div className='flex items-center justify-center'>
        <div className='text-md justify-end w-12 overflow-hidden text-ellipsis font-[200]'>
          {(transaction.value)}
        </div>
        <div className='flex w-12 justify-start font-semibold overflow-hidden text-ellipsis'>
          {transaction.asset}
        </div>
      </div>
    </div>
  )
}

export default TransactionCard;