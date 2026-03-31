import React from 'react'

const HomeCompanyLogos = () => {
    return (
        <div className='px-50 py-12 grid grid-cols-6 gap-15 transition-colors duration-300' style={{ backgroundColor: 'var(--bg-page)' }}>
            <div><img src="companyLogos/poyosis.png" alt="" style={{ filter: 'var(--text)' === '#e2e8f0' ? 'invert(0.7)' : 'none' }} /></div>
            <div><img src="companyLogos/zoodeo.png" alt="" /></div>
            <div><img src="companyLogos/insuler.png" alt="" /></div>
            <div><img src="companyLogos/skazzy.png" alt="" /></div>
            <div><img src="companyLogos/kayore.png" alt="" /></div>
            <div><img src="companyLogos/dolise.png" alt="" /></div>
        </div>
    )
}

export default HomeCompanyLogos