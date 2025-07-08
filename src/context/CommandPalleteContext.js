import { createContext, useCallback, useContext, useState } from "react";
import { CommandPalleteModal } from "../components/Layout/CommandPalette/CommandPalleteModal";
import { useEffect } from "react";

// export type Command = {
// 	id: string
// 	title: string
// 	description?: string
// 	icon?: React.ReactNode
// 	group?: string
// 	keywords?: string[]
// 	visible?: () => boolean
// 	action: () => void | Promise<void>
// }

const CommandPaletteContextType = {
	isOpen: false,
	open: () => {},
	close: () => {},
	commands: [],
	register: (cmds) => {},
	unRegister: (ids) => {}
}

const CommandPaletteContext = createContext(CommandPaletteContextType)

export const useCommandPalette = () => useContext(CommandPaletteContext);

export const usePageCommands = (commands) => {
	const { register, unRegister } = useCommandPalette()

	useEffect(() => {
		register(commands)
		return () => unRegister(commands.map(c => c.id))
	}, [])
}

export const CommandPaletteProvider = ({children}) => {
  const [isOpen, setOpen] = useState(false);
  const [commands, setCommands] = useState([]);

  const register = useCallback((cmds) => {
    setCommands(prev => [...prev, ...cmds]);
  }, []);

  const unRegister = useCallback((ids) => {
    setCommands(prev => prev.filter(cmd => !ids.includes(cmd.id)));
  }, []);

	return (
		<CommandPaletteContext.Provider
			value={{
				isOpen,
				open: () => setOpen(true),
				close: () => setOpen(false),
				commands,
				register,
				unRegister,
			}}
		>
			{children}
			
		</CommandPaletteContext.Provider>
	)
}