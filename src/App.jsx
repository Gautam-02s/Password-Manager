import { useState, useCallback, useEffect, useRef } from 'react';

function App() {
  const [length, setLength] = useState(8);
  const [numberAllowed, setNumberAllowed] = useState(false);
  const [charAllowed, setCharAllowed] = useState(false);
  const [password, setPassword] = useState('');
  const [copied, setCopied] = useState(false);
  const [website, setWebsite] = useState('');
  const [passwordName, setPasswordName] = useState('');
  const [savedPasswords, setSavedPasswords] = useState(() => {
    const saved = localStorage.getItem('savedPasswords');
    return saved ? JSON.parse(saved) : [];
  });

  const passwordRef = useRef(null);

  const passwordGenerator = useCallback(() => {
    let pass = '';
    let str = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
    if (numberAllowed) str += '0123456789';
    if (charAllowed) str += '!@#$%^&*-_+=[]{}~`';

    for (let i = 1; i <= length; i++) {
      let char = Math.floor(Math.random() * str.length);
      pass += str.charAt(char);
    }

    setPassword(pass);
  }, [length, numberAllowed, charAllowed]);

  const copyPasswordToClipboard = useCallback(() => {
    passwordRef.current?.select();
    passwordRef.current?.setSelectionRange(0, 999);
    window.navigator.clipboard.writeText(password);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000); // Reset after 2 seconds
  }, [password]);

  const savePassword = () => {
    const newEntry = { website, passwordName, password };
    const updatedPasswords = [...savedPasswords, newEntry];
    setSavedPasswords(updatedPasswords);
    localStorage.setItem('savedPasswords', JSON.stringify(updatedPasswords));
    setWebsite('');
    setPasswordName('');
    setPassword('');
  };

  const deletePassword = (index) => {
    const updatedPasswords = savedPasswords.filter((_, i) => i !== index);
    setSavedPasswords(updatedPasswords);
    localStorage.setItem('savedPasswords', JSON.stringify(updatedPasswords));
  };

  useEffect(() => {
    passwordGenerator();
  }, [length, numberAllowed, charAllowed, passwordGenerator]);

  return (
    <div className="min-h-screen bg-cover bg-center bg-[url('good-password-3d-render-concept-data-privacy.jpg')] flex flex-col items-center justify-center">
      {/* Generator Section */}
      <div className="w-full max-w-md mx-auto shadow-md rounded-lg px-4 py-3 my-8 bg-gray-800 text-orange-500">
        <h1 className='text-white text-center my-3'>Password Generator</h1>
        <div className="flex shadow rounded-lg overflow-hidden mb-4">
          <input
            type="text"
            value={password}
            className="outline-none w-full py-1 px-3"
            placeholder="Password"
            readOnly
            ref={passwordRef}
          />
          <button
            onClick={copyPasswordToClipboard}
            className={`outline-none px-3 py-0.5 shrink-0 ${copied ? 'bg-green-600 text-white' : 'bg-blue-700 text-white'}`}
          >
            {copied ? 'Copied!' : 'Copy'}
          </button>
        </div>
        <div className='flex text-sm gap-x-2'>
          <div className='flex items-center gap-x-1'>
            <input
              type="range"
              min={6}
              max={100}
              value={length}
              className='cursor-pointer'
              onChange={(e) => setLength(e.target.value)}
            />
            <label>Length: {length}</label>
          </div>
          <div className="flex items-center gap-x-1">
            <input
              type="checkbox"
              defaultChecked={numberAllowed}
              id="numberInput"
              onChange={() => setNumberAllowed(prev => !prev)}
            />
            <label htmlFor="numberInput">Numbers</label>
          </div>
          <div className="flex items-center gap-x-1">
            <input
              type="checkbox"
              defaultChecked={charAllowed}
              id="characterInput"
              onChange={() => setCharAllowed(prev => !prev)}
            />
            <label htmlFor="characterInput">Characters</label>
          </div>
        </div>
      </div>

      {/* Saver Section */}
      <div className="w-full max-w-md mx-auto shadow-md rounded-lg px-4 py-3 my-8 bg-gray-800 text-orange-500">
        <h2 className='text-white text-center my-3'>Save Password</h2>
        <div className="flex flex-col gap-y-2">
          <input
            type="text"
            value={website}
            className="outline-none py-1 px-3 mb-2"
            placeholder="Website"
            onChange={(e) => setWebsite(e.target.value)}
          />
          <input
            type="text"
            value={passwordName}
            className="outline-none py-1 px-3 mb-2"
            placeholder="Password Name"
            onChange={(e) => setPasswordName(e.target.value)}
          />
          <button
            onClick={savePassword}
            className="outline-none bg-green-700 text-white px-3 py-1 mb-4"
          >
            Save Password
          </button>
        </div>
        <h2 className="text-white text-center my-3">Saved Passwords</h2>
        <div className="text-white text-sm">
          {savedPasswords.map((entry, index) => (
            <div key={index} className="mb-2 flex justify-between items-center">
              <div>
                <div>Website: {entry.website}</div>
                <div>Password Name: {entry.passwordName}</div>
                <div>Password: {entry.password}</div>
              </div>
              <button
                onClick={() => deletePassword(index)}
                className="outline-none bg-red-600 text-white px-2 py-1 ml-2"
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;
