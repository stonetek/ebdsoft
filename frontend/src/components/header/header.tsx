import LOGO from '../../../public/image/biblia.jpg'
import avatarImage from '../../../public/image/avatarImage.jpg'


type HeaderProps = {
  hideWelcome?: boolean;
  showOnlyWelcome?: boolean;
}

function Header({ hideWelcome = false, showOnlyWelcome = false }: HeaderProps){
  const storedNomeUsuario = sessionStorage.getItem('nomeUsuario') || '';

  return (
    <div className="bg-gradient-to-r from-slate-700 w-screen h-28 flex items-center justify-between px-8">
      <div className="-mt-4 flex row-span-1">
        <img src={LOGO} alt="logo" className='w-20 h-20 ml-5 rounded-2xl mt-6'/>
        <div>
          <h1 className='mt-8 ml-2'>EBDSoft</h1>
          <p className='mt-2 ml-2 text-cyan-500'>
            Desenvolvido por
            <a href="https://www.instagram.com/pedrors99999/" target={'_blank'}> Pedro Paulo</a>
          </p>
        </div>
      </div>

      {!hideWelcome && (
        <div className="flex items-center mr-8">
          <img src={avatarImage} alt="Avatar" className="w-10 h-10 rounded-full mr-2" />
          {showOnlyWelcome ? (
            <span className="text-sky-300">Bem-vindo(a)</span>
          ) : (
            <span className="text-sky-300">Bem-vindo(a), {storedNomeUsuario || 'Usuário'}</span>
          )}
        </div>
      )}
    </div>
  )
}
export default Header;