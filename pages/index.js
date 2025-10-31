import Image from "next/image";
import Link from "next/link";
import React, {
  useState,
  useRef,
  useEffect,
  useContext,
  useReducer,
} from "react";
import Router, { useRouter } from "next/router";
import AppContext from "../libs/contexts/AppContext";
import {Button, ButtonGroup} from "@heroui/button";

export default function HomePage() {
    const appContext = useContext(AppContext);
    const router = useRouter();

    useEffect(() => {
        
    }, []);

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
            <h1 className="text-3xl font-bold mb-6">หน้า Next.js ตัวอย่าง 💻</h1>
            <h1 className="text-3xl font-bold underline text-red-500">
                NEXT JS - Tailwind CSS - HeroUI
            </h1>
            <Button className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg">
                ปุ่ม HeroUI
            </Button>
           
        </div>
    );
}
