import { useEffect, useRef } from 'react'
import EditIcon from "../../shared/icons/pencil.svg?react";
import TrashIcon from "../../shared/icons/trash.svg?react";
import UserBlockIcon from "../../shared/icons/user-block.svg?react";
import RotateLockIcon from "../../shared/icons/rotate-lock.svg?react";

interface MessageOptionsProps {
  id: string | null;
  top: number | null;
  left: number | null;
  closeOptions: () => void;
  handleClickDelete: (id: string) => void;
  handleClickEdit: (id: string) => void;
  handleClickBlock: (id: string) => void;
  handleClickResetPassword: (id: string) => void;
  isBlock?: boolean;
}

const TableOptions = ({
  id,
  top,
  left,
  closeOptions,
  handleClickDelete,
  handleClickEdit,
  handleClickBlock,
  handleClickResetPassword,
  isBlock,
}: MessageOptionsProps) => {

  const optionRef = useRef<HTMLDivElement>(null)  

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        optionRef.current &&
        !optionRef.current.contains(event.target as Node)
      ) {
        closeOptions();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  

  if (!id) return null;

  return (
    <div
      ref={optionRef}
      style={{
        top: `calc(${top}px + 20px)`,
        left: `calc(${left}px - 115px)`
      }}
      className={`w-[156px] !py-[8px] absolute z-[1000] !bg-[#fff] rounded-[6px] shadow-[0px_2px_4px_0px_rgba(0,0,0,0.08),_0px_0px_2px_0px_rgba(0,0,0,0.08)]`}
    >
      <button
        onClick={() => handleClickBlock(id)}
        className='w-full !px-[12px] !py-[8px] flex gap-[6px] items-center hover:!bg-[#E6F0FE] !text-[#005A9E] transition duration-300'
      >
        <span className='!text-[#005A9E]'>
          <UserBlockIcon/>
        </span>
        <span className='!text-[inherit]'>
          {
            isBlock ?
            "Blokdan çıxar" :
            "Blokla"
          }
        </span>
      </button>

      <button
        onClick={() => handleClickResetPassword(id)}
        className='w-full !px-[12px] !py-[8px] flex gap-[6px] items-center hover:!bg-[#E6F0FE] !text-[#005A9E] transition duration-300'
      >
        <span className='!text-[#005A9E]'>
          <RotateLockIcon/>
        </span>
        <span className='!text-[inherit]'>
          Şifrəni sıfırla
        </span>
      </button>

      <button
        onClick={() => handleClickEdit(id)}
        className='w-full !px-[12px] !py-[8px] flex gap-[6px] items-center hover:!bg-[#E6F0FE] !text-[#005A9E] transition duration-300'
      >
        <span className='!text-[#005A9E]'>
          <EditIcon/>
        </span>
        <span className='!text-[inherit]'>
          Düzəliş et
        </span>
      </button>

      {/* <button
        onClick={() => handleClickDelete(id)}
        className='w-full !px-[12px] !py-[8px] flex gap-[4px] items-center hover:!bg-[#E6F0FE] !text-[#005A9E] transition duration-300'
      >
        <span className='!text-[#005A9E]'>
          <TrashIcon/>
        </span>
        <span className='!text-[inherit]'>
          Sil
        </span>
      </button> */}
    </div>
  )
}

export default TableOptions