import { cn } from "@/lib/utils"
import Link from "next/link"

export default function Button(props: {
    children: React.ReactNode,
    type?: ("submit" | "button" | "reset")
    href?: string | URL,
    className?: string
}) {

    if(props.href) {
        return (
            <Link href={props.href} className={cn("flex items-center justify-center font-bold bg-secondary hover:bg-tertiery px-5 py-1 rounded-md transition-all duration-100", props.className)}>
                {props.children}
            </Link>
        )
    } 
    return (
        <button type={(!props.type) ? "submit" : props.type} className={cn("flex items-center justify-center font-bold bg-secondary hover:bg-tertiery px-5 py-1 rounded-md transition-all duration-100", props.className)}>
            {props.children}
        </button>
    )
}