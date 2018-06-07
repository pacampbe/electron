'use strict'

const assert = require('assert')
const {closeWindow} = require('./window-helpers')

const {remote} = require('electron')
const {BrowserView, BrowserWindow} = remote

describe('BrowserView module', () => {
  let w = null
  let view = null

  beforeEach(() => {
    w = new BrowserWindow({
      show: false,
      width: 400,
      height: 400,
      webPreferences: {
        backgroundThrottling: false
      }
    })
  })

  afterEach(() => {
    if (view) {
      view.destroy()
      view = null
    }

    return closeWindow(w).then(() => { w = null })
  })

  describe('BrowserView.destroy()', () => {
    it('does not throw', () => {
      view = new BrowserView()
      expect(() => { view.destroy() }).to.not.throw()
    })
  })

  describe('BrowserView.isDestroyed()', () => {
    it('returns correct value', () => {
      view = new BrowserView()
      expect(!view.isDestroyed()).to.be.true
      view.destroy()
      expect(view.isDestroyed()).to.be.true
    })
  })

  describe('BrowserView.setBackgroundColor()', () => {
    it('does not throw for valid args', () => {
      view = new BrowserView()
      expect(() => { view.setBackgroundColor('#000') }).to.not.throw()
    })

    it('throws for invalid args', () => {
      view = new BrowserView()
      expect(() => {
        view.setBackgroundColor(null)
      }).to.throw(/conversion failure/)
    })
  })

  describe('BrowserView.setAutoResize()', () => {
    it('does not throw for valid args', () => {
      view = new BrowserView()
      view.setAutoResize({})
      view.setAutoResize({ width: true, height: false })
    })

    it('throws for invalid args', () => {
      view = new BrowserView()
      expect(() => {
        view.setAutoResize(null)
      }).to.throw(/conversion failure/)
    })
  })

  describe('BrowserView.setBounds()', () => {
    it('does not throw for valid args', () => {
      view = new BrowserView()
      expect(() => {
        view.setBounds({ x: 0, y: 0, width: 1, height: 1 })
      }).to.not.throw()
    })

    it('throws for invalid args', () => {
      view = new BrowserView()
      expect(() => { view.setBounds(null) }).to.throw(/conversion failure/)
      expect(() => { view.setBounds({}) }).to.throw(/conversion failure/)
    })
  })

  describe('BrowserWindow.setBrowserView()', () => {
    it('does not throw for valid args', () => {
      view = new BrowserView()
      expect(w.setBrowserView(view)).to.not.throw()
    })

    it('does not throw if called multiple times with same view', () => {
      view = new BrowserView()
      w.setBrowserView(view)
      w.setBrowserView(view)
      w.setBrowserView(view)
    })
  })

  describe('BrowserWindow.getBrowserView()', () => {
    it('returns the set view', () => {
      view = new BrowserView()

      w.setBrowserView(view)
      expect(view.id).to.not.be.null

      let view2 = w.getBrowserView()
      expect(view2.webContents.id).to.equal(view.webContents.id)
    })

    it('returns null if none is set', () => {
      let view = w.getBrowserView()
      expect(view).to.be.null
    })
  })

  describe('BrowserView.webContents.getOwnerBrowserWindow()', () => {
    it('points to owning window', () => {
      view = new BrowserView()
      expect(!view.webContents.getOwnerBrowserWindow()).to.be.true

      w.setBrowserView(view)
      expect(view.webContents.getOwnerBrowserWindow()).to.equal(w)

      w.setBrowserView(null)
      expect(!view.webContents.getOwnerBrowserWindow()).to.be.true
    })
  })

  describe('BrowserView.fromId()', () => {
    it('returns the view with given id', () => {
      view = new BrowserView()

      w.setBrowserView(view)
      expect(view.id).to.not.be.null

      let view2 = BrowserView.fromId(view.id)
      expect(view2.webContents.id).to.equal(view.webContents.id)
    })
  })

  describe('BrowserView.fromWebContents()', () => {
    it('returns the view with given id', () => {
      view = new BrowserView()

      w.setBrowserView(view)
      expect(view.id).to.not.be.null

      let view2 = BrowserView.fromWebContents(view.webContents)
      expect(view2.webContents.id).to.equal(view.webContents.id)
    })
  })

  describe('BrowserView.getAllViews()', () => {
    it('returns all views', () => {
      view = new BrowserView()

      w.setBrowserView(view)
      expect(view.id).to.not.be.null

      const views = BrowserView.getAllViews()
      expect(views.length).to.equal(1)
      expect(views[0].webContents.id).to.equal(view.webContents.id)
    })
  })
})
