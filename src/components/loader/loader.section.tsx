import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/src/components/ui/dialog";
import { X } from "lucide-react";

const LoadingModal = ({
  openStatus,
  setOpenStatus,
  text = "Loading...",
}: {
  openStatus: boolean;
  setOpenStatus: any;
  text?: string;
}) => {
  return (
    <Dialog open={openStatus}>
      <DialogTrigger asChild></DialogTrigger>
      <DialogContent className="sm:max-w-md border border-slate-900 bg-slate-950 h-auto flex flex-col justify-start">
        <DialogHeader className="flex flex-row items-center justify-between">
          <DialogTitle className="text-white">Keep Patience!!</DialogTitle>
          {/* <X
            className="text-white cursor-pointer"
            size={20}
            onClick={() => setOpenStatus(false)}
          /> */}
        </DialogHeader>
        <div className="flex flex-col justify-center items-center h-64">
          <div className="animate-spin rounded-full h-20 w-20 border-t-2 border-b-2 border-primary"></div>
          <p className="text-white mt-4 tran">{text}</p>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default LoadingModal;
